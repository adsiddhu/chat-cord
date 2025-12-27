"use client";
import React, { useEffect } from "react";
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import axios from "axios"
import qs from "query-string"
import queryString from "query-string";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"

import {
    Select,
    SelectItem,
    SelectValue,
    SelectTrigger,
    SelectContent
} from "@/components/ui/select"

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Channel name is required",
    }).refine(
        name => name != "general",
        {
            message: "channel name can't be 'general' or 'channel'"
        }
    ),
    type: z.nativeEnum(ChannelType)
})

const EditChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal()
    const router = useRouter()

    const isModalOpen = isOpen && type === "editChannel"
    const { channel, server } = data

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            // type: undefined
            type: ChannelType.TEXT
        },
    })

    useEffect(() => {
        if (channel) {
            form.setValue("name", channel.name)
            form.setValue("type", channel.type)
        }
    }, [channel, form])

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })
            await axios.patch(url, values)
            form.reset()
            router.refresh()
            onClose()
        } catch (error) {
            console.log(error);
        }
    }

    const handelClose = () => {
        form.reset()
        onClose()
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handelClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden custom-center">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Edit Channel
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-6 pb-6">
                        <div className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Channel Name
                                        </FormLabel>

                                        <FormControl style={{ background: "#EEEEEE" }}>
                                            <Input
                                                {...field}
                                                disabled={isLoading}
                                                placeholder="Enter Channel Name"
                                                className="w-full bg-zinc-100 border border-zinc-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 capitalize"
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Channel Type</FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className="w-full bg-zinc-100 border border-zinc-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 capitalize"
                                                >
                                                    <SelectValue placeholder="Select a Channel Type" />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {Object.values(ChannelType).map((type) => (
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                        className="capitalize"
                                                    >
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>

                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="flex bg-gray-100 py-4">
                            <Button type="submit" disabled={isLoading} variant="primary" className="min-w-full">
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditChannelModal
