# image_process.py
import uuid
from io import BytesIO
from urllib.parse import urlparse

import boto3
from config import settings
from PIL import Image, ImageOps
from starlette.concurrency import run_in_threadpool

# Reuse boto3 client instance to avoid reconnect overhead on every request
_r2_client = None


def _get_r2_client():
    global _r2_client
    if _r2_client is None:
        # Fallback to standard Cloudflare endpoint if r2_endpoint_url is None
        endpoint_url = (
            settings.r2_endpoint_url
            if settings.r2_endpoint_url
            else f"https://{settings.cloudflare_account_id}.r2.cloudflarestorage.com"
        )

        _r2_client = boto3.client(
            "s3",
            endpoint_url=endpoint_url,
            aws_access_key_id=settings.r2_access_key_id.get_secret_value(),
            aws_secret_access_key=settings.r2_secret_access_key.get_secret_value(),
            region_name="auto",  # Compatible with Cloudflare R2 and botocore/moto
        )
    return _r2_client


def _process_profile_image_sync(content: bytes) -> tuple[bytes, str]:
    with Image.open(BytesIO(content)) as original:
        img = ImageOps.exif_transpose(original)
        img = ImageOps.fit(img, (300, 300), method=Image.Resampling.LANCZOS)

        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGB")

        filename = f"{uuid.uuid4().hex}.jpg"

        output = BytesIO()
        img.save(output, "JPEG", quality=85, optimize=True)
        output.seek(0)

    return output.getvalue(), filename


async def process_profile_image(content: bytes) -> tuple[bytes, str]:
    """Runs Pillow image processing in a threadpool so it won't block the asyncio event loop."""
    return await run_in_threadpool(_process_profile_image_sync, content)


def _upload_to_r2(file_bytes: bytes, key: str) -> None:
    r2 = _get_r2_client()
    r2.upload_fileobj(
        BytesIO(file_bytes),
        settings.r2_bucket_name,
        key,
        ExtraArgs={"ContentType": "image/jpeg"},
    )


def _delete_from_r2(key: str) -> None:
    r2 = _get_r2_client()
    r2.delete_object(Bucket=settings.r2_bucket_name, Key=key)


async def upload_profile_image(file_bytes: bytes, filename: str) -> str:
    """
    Uploads processed image bytes to R2 and returns the complete public URL.
    """
    key = f"profile_pics/{filename}"
    await run_in_threadpool(_upload_to_r2, file_bytes, key)

    if settings.r2_public_domain:
        return f"{settings.r2_public_domain.rstrip('/')}/{key}"
    return key


async def delete_profile_image(image_url_or_filename: str | None) -> None:
    """
    Deletes profile image from R2 using either a full public URL or key filename.
    """
    if not image_url_or_filename:
        return

    if image_url_or_filename.startswith(("http://", "https://")):
        key = urlparse(image_url_or_filename).path.lstrip("/")
    elif not image_url_or_filename.startswith("profile_pics/"):
        key = f"profile_pics/{image_url_or_filename}"
    else:
        key = image_url_or_filename

    await run_in_threadpool(_delete_from_r2, key)