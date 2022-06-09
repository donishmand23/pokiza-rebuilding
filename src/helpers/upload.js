import { InternalServerError } from '#errors'
import TransportQuery from '#sql/transport'
import { finished } from 'stream/promises'
import ProductQuery from '#sql/product'
import { fetch } from '#utils/postgres'
import StaffQuery from '#sql/staff'
import path from 'path'
import fs from 'fs'

export default async (args) => {
	try {
		if (args?.file) {
			const { createReadStream, filename, mimetype, encoding } = await args.file

			const allowedMimetypes = {
				'image/jpeg': true,
				'image/jpg': true,
				'image/png': true,
			}

			if (!allowedMimetypes[mimetype]) {
				throw new Error("The file must be jpg or png!")
			}

			const stream = createReadStream()
			const fileName = (Date.now() % 100000) + filename.replace(/\s/g, "")
			const filePath = path.join(process.cwd(), 'uploads', fileName)
			const out = fs.createWriteStream(filePath)
			await stream.pipe(out)
			await finished(out)
			args.file = fileName
			
			if (args.staffId) {
				const oldFile = fetch(StaffQuery.STAFF_PHOTO, args.staffId)
				if (oldFile.staff_img) fs.unlinkSync(path.join(process.cwd(), 'uploads', oldFile.staff_img))
			}

			if (args.productId) {
				const oldFile = fetch(ProductQuery.PRODUCT_PHOTO, args.productId)
				if (oldFile.product_img) fs.unlinkSync(path.join(process.cwd(), 'uploads', oldFile.product_img))
			}

			if (args.transportId) {
				const oldFile = fetch(TransportQuery.TRANSPORT_PHOTO, args.transportId)
				if (oldFile.transport_img) fs.unlinkSync(path.join(process.cwd(), 'uploads', oldFile.transport_img))
			}

			return
		} else return
	} catch (error) {
		throw new InternalServerError(error.message || error.detail || error)
	}
}