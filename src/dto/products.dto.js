export default class ProductsInsertDTO {
    constructor(products){
        this.title = products?.title ?? 'Agregar título del producto'
        this.description = products?.description ?? 'Agregar descripción del producto'
        this.price = products?.price ?? 0
        this.thumbnail = products?.thumbnail ?? 'Producto sin imagen'
        this.code = products?.code ?? 'Producto no cofificado'
        this. stock = products?.stock ?? 0
        this.category = products?.category ?? 'Producto no categorizado'
        this.status = products?.status ?? true
        this.owner = products?.owner ?? ''
    }
}








