import { fetch } from '#utils/postgres'
import { finished } from 'stream'
import StaffQuery from '#sql/staff'
import path from 'path'
import fs from 'fs'

export default async (args) => {
	if(args?.file) {
		const { createReadStream, filename, mimetype, encoding } = await args.file

		const allowedMimetypes = {
			'image/jpeg': true,
			'image/jpg': true,
			'image/png': true,
		}

		if(!allowedMimetypes[mimetype]) {
			throw new Error("Yuklanayotgan file jpg yoki png rasm bo'lishi kerak!")
		}

		const stream = createReadStream()
		const fileName = Date.now() + filename.replace(/\s/g, "")
		const filePath = path.join(process.cwd(), 'uploads', fileName)
		const out = fs.createWriteStream(filePath)
      	stream.pipe(out)
      	await finished(out)
      	args.file = fileName

      	if(args.staffId) {
      		const oldFile = fetch(StaffQuery.STAFF_PHOTO, args.staffId)
      		if(oldFile.staff_img) fs.unlinkSync(path.join(process.cwd(), 'uploads', oldFile.staff_img))
      	}

      	return
	} else return
}