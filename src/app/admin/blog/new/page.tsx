import { requirePageAdmin } from "@/lib/admin-auth"
import BlogForm from '../blog-form'

export default async function NewBlogPage() {
    await requirePageAdmin('tours', 'CREATE');
    return <BlogForm />
}
