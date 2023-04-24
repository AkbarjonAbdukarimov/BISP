import Link from "next/link";

export default function Home({ currentUser }) {
  return (
    <>
      <h1>Welcome Back {currentUser && currentUser.email}</h1>
    </>
  )
}
