import { z } from "zod";
import {
	type UserFollowUndoInput,
	type UserFollowInput,
	TopicsOrder,
	PostsOrder,
	CommentsOrder,
	CollectionsOrder,
} from "./types";

type Properties<T> = Required<{
	[K in keyof T]: z.ZodType<T[K], any, T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny =>
	v !== undefined && v !== null;

export const definedNonNullAnySchema = z
	.any()
	.refine((v) => isDefinedNonNullAny(v));

export const TopicsOrderSchema = z.nativeEnum(TopicsOrder);

export const PostsOrderSchema = z.nativeEnum(PostsOrder);

export const CommentsOrderSchema = z.nativeEnum(CommentsOrder);

export const CollectionsOrderSchema = z.nativeEnum(CollectionsOrder);

export const UserFollowUndoInputSchema: z.ZodObject<
	Properties<UserFollowUndoInput>
> = z.object({
	clientMutationId: z.string().nullish(),
	userId: z.string(),
});

export const UserFollowInputSchema: z.ZodObject<Properties<UserFollowInput>> =
	z.object({
		clientMutationId: z.string().nullish(),
		userId: z.string(),
	});
