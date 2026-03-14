export default function LoginPage() {
  return (
    <form action="/auth/login" method="GET">
      <button type="submit">Login with Google</button>
    </form>
  );
}
