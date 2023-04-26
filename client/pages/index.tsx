import buildClient from "@/api/buildClient";
import Link from "next/link";

export default function Home({ currentUser }) {
  return (
    <>
      <div className="container">


      </div>
    </>
  )
}
Home.getInitialProps = async (client, ctx,) => {
  const posts = await client.get('/api/posts');
  return { posts }
}