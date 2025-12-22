import Link from "next/link";

export const SignOutButton = () => {
  return (
    <Link href="/auth/cleanup" className="btn btn-outlie btn-primary">
      サインアウト
    </Link>
  );
};
