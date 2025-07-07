"use client"
import React from 'react'
import { useParams, useRouter } from "next/navigation";

const page = () => {
    const { id: postId } = useParams();
  return (
    <div>this is a single community</div>
  )
}

export default page