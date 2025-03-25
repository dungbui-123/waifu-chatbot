def generate_slug(string: str) -> str:
    """
    Generate a slug from a string.

    Args:
        string (str): The string to generate a slug from.

    Returns:
        str: The slug generated from the string.
    """

    return string.replace(" ", "-").lower()
