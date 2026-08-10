"""
Quick script to verify Cloudflare R2 credentials and permissions.

Run with: uv run check_r2.py (or python check_r2.py)

This checks that your .env credentials can upload to and delete from your Cloudflare R2 bucket
without needing to go through the full application flow.
"""

from io import BytesIO

from botocore.exceptions import BotoCoreError, ClientError
from config import settings
from image_utils import _get_r2_client


def check_r2_connection():
    r2 = _get_r2_client()

    endpoint = (
        settings.r2_endpoint_url
        if settings.r2_endpoint_url
        else f"https://{settings.cloudflare_account_id}.r2.cloudflarestorage.com"
    )

    print(f"Bucket:   {settings.r2_bucket_name}")
    print(f"Endpoint: {endpoint}")
    print(f"Account:  {settings.cloudflare_account_id}")
    print()

    test_key = "profile_pics/test.txt"

    # Test upload
    try:
        r2.upload_fileobj(
            BytesIO(b"test connection"),
            settings.r2_bucket_name,
            test_key,
            ExtraArgs={"ContentType": "text/plain"},
        )
        print("Upload: SUCCESS")
    except (BotoCoreError, ClientError) as e:
        print(f"Upload: FAILED - {e}")
        return

    # Test delete
    try:
        r2.delete_object(Bucket=settings.r2_bucket_name, Key=test_key)
        print("Delete: SUCCESS")
    except (BotoCoreError, ClientError) as e:
        print(f"Delete: FAILED - {e}")
        return

    print()
    print("All tests passed! Your Cloudflare R2 configuration is working.")


if __name__ == "__main__":
    check_r2_connection()