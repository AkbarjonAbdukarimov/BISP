import buildClient from "@/api/buildClient";
import MediaCard from "@/components/Card";
import { Card } from "@mui/material";
import axios from "axios";
import Link from "next/link";
//@ts-ignore
export default function Home({ currentUser, posts }) {
  return (
    <>
      <div className=" w-100 row justify-content-center ">
        <div className="col-6">
          {//@ts-ignore
            posts.map(p => { return <MediaCard key={p.id} post={p} /> })}

        </div>

      </div>
    </>
  )
}
//@ts-ignore
Home.getInitialProps = async (context, client, currentUser) => {
  const posts = await client.get('/api/posts');
  return { posts: posts.data }
}