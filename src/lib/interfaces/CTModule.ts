import type CTRelease from "./CTRelease"

export default interface CTModule {
    id: number,
    owner: {
        id: number,
        name: string,
        rank: string
    }, // The owner of the module
    name: string,
    description: string,
    image: string,
    downloads: number,
    tags: Array<string>,
    releases: Array<CTRelease>
}