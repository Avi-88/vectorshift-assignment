import { z } from "zod"
import { NodeHandle } from "./handleSchema"
import { NodeInput } from "./inputFieldSchema"

export const Node = z.object({
    title: z.string().min(1),
    subTitle: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    handles: z.array(NodeHandle), // Allow empty arrays for nodes like Note
    inputFields: z.array(NodeInput).optional(),
    accentColor: z.enum(["blue", "purple", "pink", "green"]).optional(),
})

