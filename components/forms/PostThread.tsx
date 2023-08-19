"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { usePathname , useRouter } from "next/navigation";

import { updateUser } from "@/lib/actions/user.action";
import { userValidation } from "@/lib/validations/user";
import { threadValidation } from "@/lib/validations/thread";
interface Props {
  user : {
    id : string;
    objectId : string;
    username : string;
    name : string;
    bio : string;
    image : string
  };
  btnTitle : string;
}


const PostThread = ({userId} : {userId : String}) => {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver : zodResolver(threadValidation),
    defaultValues : {
      thread :  "",
      accuntId : userId
    }
  })
  return (
    <h1>Post Thread Form</h1>
  )
}

export default PostThread