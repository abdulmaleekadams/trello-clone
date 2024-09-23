import { Comment } from "@prisma/client";
import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { DeleteCommentFormSchema } from "../schema";

export type InputType = z.infer<typeof DeleteCommentFormSchema>;
export type ReturnType = ActionState<InputType, Comment>;
