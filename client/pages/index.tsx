import Link from "next/link";

export default function Home({ currentUser }) {
  return (
    <>
      <div className="container">

        <h1>Welcome Back {currentUser && currentUser.email}</h1>
      </div>
    </>
  )
}
