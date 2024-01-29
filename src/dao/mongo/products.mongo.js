import ProductsModel from './models/products.model.js'

export const getProducts = async ( limit, page, query, sort, category, status ) => {

    limit = parseInt(limit ? limit : 10)
    page = parseInt(page ? page : 1)
    query = query ?? ''
    sort = sort ? sort : 'asc'

    category = category ? category : ''
    status = status


    const search = {}
    if (query) search.title = { '$regex': query, '$options': 'i' }
    if (category) search.category = category
    if (status) search.status = status


    const options = {
        page: page,
        limit: limit,
        lean: true,
        sort: {}
    }

    if (sort) {
        options.sort.price = sort == 'asc' ? 1 : -1
    }

    const result = await ProductsModel.paginate(search, options)

    result.payload = result.docs
    result.query = ''
    delete result.docs

    return result
}

export const getProductById = async (pid) => {
    return await ProductsModel.findById(pid)
}

export const getProductByCode = async (code) => {
    return await ProductsModel.findOne({ code })
}

export const addProduct = async (body) => {
    return await ProductsModel.create({ ...body })
}

export const updateProduct = async (pid, rest) => {
    return await ProductsModel.findByIdAndUpdate(pid, { ...rest }, { new: true })
}

export const deleteProduct = async (pid) => {
    return await ProductsModel.findByIdAndDelete(pid)
}


