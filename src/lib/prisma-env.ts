import * as path from 'node:path'

if (process.env.NODE_ENV === 'production') {
    // Force Prisma to load the query engine from the bundled location on Vercel
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = path.join(
        process.cwd(),
        'src/generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node'
    )
}
