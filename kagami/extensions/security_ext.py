import bcrypt


class Encrypt:
    @staticmethod
    def check_hashed_password(hashed_password: str, raw_password: str) -> bool:
        return bcrypt.checkpw(
            hashed_password=hashed_password.encode("utf-8"),
            password=raw_password.encode("utf-8"),
        )
