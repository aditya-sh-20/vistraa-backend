import os
import time

def cleanup_old_patterns(directory: str = "generated_patterns", max_age_seconds: int = 3600):
    """
    Deletes files in the target directory that are older than max_age_seconds (Default: 1 Hour).
    """
    if not os.path.exists(directory):
        return

    now = time.time()
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        if os.path.isfile(file_path):
            file_age = now - os.path.getmtime(file_path)
            if file_age > max_age_seconds:
                try:
                    os.remove(file_path)
                except Exception as e:
                    print(f"Failed to delete {file_path}: {str(e)}")