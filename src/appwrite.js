import { Client, Databases, Query, ID } from 'appwrite'

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)

const database = new Databases(client)

export const updateSearchCount = async (searchTerm, movie, ) => {
    try {
        const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID,
            [Query.equal('searchTerm', searchTerm)]
        )
        if (response.documents.length > 0) {
            const document = response.documents[0]
            const count = document.count + 1
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, document.$id, {
                count
            })
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            })
        }
        console.log(response)
    } catch (error) {
        console.error(error)
    }
}

export const getTrendingMovies = async () => {
    try {
        const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID,
            [Query.orderDesc('count'), Query.limit(5)]
        )
        return response.documents
    } catch (error) {
        console.error(error)
    }
}