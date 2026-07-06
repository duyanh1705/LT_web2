import { keyframes } from "@emotion/react";
import axios from "axios";
import { error } from "console";
import { CreateParams, CreateResult, DataProvider, DeleteManyParams, DeleteManyResult, DeleteParams, DeleteResult, GetManyParams, GetManyReferenceParams, GetManyReferenceResult, GetManyResult, GetOneParams, GetOneResult, Identifier, QueryFunctionContext, RaRecord, UpdateManyParams, UpdateManyResult, UpdateParams, UpdateResult } from "react-admin";

const apiUrl = 'http://localhost:8080/api';

const httpClient = {
    get: (url: string) => {
        const token = localStorage.getItem('jwt-token');

        return axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }).then(response => ({ json: response.data }))
            .catch(error => {
                console.error('API request failed:', error);
                throw error;
            });
    },
    post: (url: string, data: any) => {
        const token = localStorage.getItem('jwt-token');
        return axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }).then(response => ({ json: response.data }))
            .catch(error => {
                console.error('API request failed:', error);
                throw error;
            });
    },
    put: (url: string, data: any) => {
        const token = localStorage.getItem('jwt-token');
        return axios.put(url, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }).then(response => ({ json: response.data }))
            .catch(error => {
                console.error('API request failed:', error);
                throw error;
            });
    },
    delete: (url: string, p0: { data: { ids: any[]; }; }) => {
        const token = localStorage.getItem('jwt-token');

        return axios.delete(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }).then(response => ({ json: response.data }))
            .catch(error => {
                console.error('API request failed:', error);
                throw error;
            });
    },
};
export const dataProvider: DataProvider = {
    getList: (resource: string, { pagination = {}, sort = {}, filter = {} }) => {
        const { page = 1, perPage = 10 } = pagination as {
            page?: number;
            perPage?: number;
        };

        const { field = "id", order = "ASC" } = sort as {
            field?: string;
            order?: "ASC" | "DESC";
        };


        const idFieldMapping: { [key: string]: string; } = {
            products: 'productId',
            categories: 'categoryId',
        };

        const idField = idFieldMapping[resource] || 'id';

        const query = {
            pageNumber: page.toString(),
            pageSize: perPage.toString(),
            sortBy: field,
            sortOrder: order,
            ...filter
        };
        console.log('Request filter:', filter);
        let url: string;
        if (filter && filter.search) {
            const keyword = filter.search;
            delete query.search;
            url = `${apiUrl}/public/${resource}/keyword/${encodeURIComponent(keyword)}?${new URLSearchParams(query).toString()}`;
        } else if (filter && filter.categoryId) {
            const categoryId = filter.categoryId;
            delete query.categoryId;
            url = `${apiUrl}/public/categories/${categoryId}/${resource}?${new URLSearchParams(query).toString()}`;
        } else {
            url = `${apiUrl}/public/${resource}?${new URLSearchParams(query).toString()}`;
        }
        console.log('Request URL:', url);
        return httpClient.get(url).then(({ json }) => {
            const IMAGE_BASE_URL = 'http://localhost:8080/api/public/products/image/';

            const data = json.content.map((item: any) => {
                // ✅ xác định id đúng theo resource
                const id =
                    resource === 'products'
                        ? item.productId
                        : resource === 'categories'
                            ? item.categoryId
                            : item.id;

                // chỉ products mới có image
                if (resource === 'products') {
                    let image = item.image;

                    if (image && image.startsWith('http')) {
                        return { id, ...item, image };
                    }

                    return {
                        id,
                        ...item,
                        image: image ? IMAGE_BASE_URL + image : null,
                    };
                }

                // categories
                return {
                    id,
                    ...item,
                };
            });

            return {
                data,
                total: json.totalElements,
            };
        });

    },
    delete: async <RecordType extends RaRecord = any>(resource: string, params: DeleteParams<RecordType>): Promise<DeleteResult<RecordType>> => {
        try {
            const url = `${apiUrl}/admin/${resource}/${params.id}`;
            await httpClient.delete(url, {
                data: {
                    ids: [params.id],
                },
            });
            return {
                data: params.previousData as RecordType,
            };
        } catch (error) {
            console.error('API request failed:', error);
            throw new Error('Error deleting record');
        }
    },
    deleteMany: async <RecordType extends RaRecord = any>(
        resource: string,
        params: DeleteManyParams
    ): Promise<DeleteManyResult<RecordType>> => {
        const { ids } = params;
        try {
            const deletePromise = ids.map(id => {
                const url = `${apiUrl}/admin/${resource}/${id}`;
                return httpClient.delete(url, {
                    data: {
                        ids: [id],
                    },
                });
            });
            await Promise.all(deletePromise);
            return {
                data: ids,
            };
        } catch (error) {
            console.error('API request failed:', error);
            throw new Error('Error deleting records');
        }
    },
    getManyReference: function <RecordType extends RaRecord = any>(resource: string, params: GetManyReferenceParams & QueryFunctionContext): Promise<GetManyReferenceResult<RecordType>> {
        throw new Error('Function not implemented.');
    },
    updateMany: function <RecordType extends RaRecord = any>(resource: string, params: UpdateManyParams):
        Promise<UpdateManyResult<RecordType>> {
        throw new Error('Function not implemented.');
    },
    create: async (resource: string, params: CreateParams): Promise<CreateResult> => {
    let url: string;

    if (resource === "products") {
        url = `${apiUrl}/admin/categories/${params.data.categoryId}/${resource}`;
        delete params.data.categoryId;
        params.data.image = 'default.png';
    } else {
        url = `${apiUrl}/admin/${resource}`;
    }

    const result = await httpClient.post(url, params.data);

    // ✅ map id đúng cho react-admin
    const id =
        resource === "products"
            ? result.json.productId
            : resource === "categories"
                ? result.json.categoryId
                : result.json.id;

    return {
        data: {
            ...result.json,
            id, // 👈 BẮT BUỘC
        },
    };
},

    update: async (resource: string, params: UpdateParams): Promise<UpdateResult> => {
        const url = `${apiUrl}/admin/${resource}/${params.id}`;
        const { data } = params;

        const result = await httpClient.put(url, data);

        const updatedData = {
            id: params.id,
            ...result.json
        };
        return { data: updatedData };
    },
    getOne: async (resource: string, params: GetOneParams): Promise<GetOneResult> => {
    const url = `${apiUrl}/public/${resource}/${params.id}`;
    const result = await httpClient.get(url);

    const idFieldMapping: { [key: string]: string } = {
        products: 'productId',
        categories: 'categoryId',
    };

    const idField = idFieldMapping[resource] || 'id';

    const data = {
        id: result.json[idField], // ✅ ĐÚNG
        ...result.json,
    };

    return { data };
},

    getMany: async (resource: string, params: GetManyParams): Promise<GetManyResult> => {
        const idFieldMapping: { [key: string]: string } = {
            products: 'productId',
            categories: 'categoryId',
        };
        console.log('Request resource:', resource);
        console.log('Request params:', params);

        const idField = idFieldMapping[resource] || 'id';

        const ids = params.ids.join(',');

        let url: string;
        if (resource === "products") {
            url = `${apiUrl}/public/categories/${ids}${resource}`;
        } else {
            url = `${apiUrl}/public/${resource}`;
        }
        console.log('Request URL getMany:', url);

        const result = await httpClient.get(url);
        console.log('Request result:', result);
        console.log('Request result JSON:', result.json);

        const data = result.json.content.map((item: any) => ({
            id: item[idField],
            ...item,
        }));
        return { data };
    },
};
