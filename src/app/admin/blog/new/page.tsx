import { requireAdmin } from "@/lib/admin-auth"
import BlogForm from '../blog-form'

export default async function NewBlogPage() {
    await requireAdmin();
    return <BlogForm />
}
