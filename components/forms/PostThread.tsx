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

  const onSubmit = () => {

  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} 
      className="flex flex-col justify-start gap-10">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1 text-gray-200">
                <Textarea 
                  rows={15}
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default PostThread