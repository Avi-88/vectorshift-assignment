import { z } from "zod"

export const NodeInput = z.object({
    key: z.string().min(1),
    type: z.enum(["text", "select", "number", "textarea", "checkbox"]),
    label: z.string().min(1),
    options: z.array(z.union([
        z.string(),
        z.object({
            value: z.string(),
            label: z.string()
        })
    ])).optional(),
    defaultValue: z.any().optional(), 
    placeholder: z.string().optional(),
    required: z.boolean().optional(),
    disabled: z.boolean().optional(),
    style: z.record(z.string(), z.any()).optional(), 
    dynamicSize: z.boolean().optional(),
    minHeight: z.number().optional(),
    maxHeight: z.number().optional(),
    minWidth: z.number().optional(),
    maxWidth: z.number().optional(),
}).refine((data) => {
    if(data.type === "select" && !data.options){
        return false;
    }
    return true;
}, {
    message: "Options are required when type is 'select'",
    path: ["options"]
})