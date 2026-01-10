import { Position } from "reactflow"
import { z } from "zod"

export const NodeHandle = z.object({
    id: z.string().min(1),
    type: z.enum(["target", "source"]),
    style: z.record(z.string(), z.any()).optional(),
    position: z.nativeEnum(Position)
})