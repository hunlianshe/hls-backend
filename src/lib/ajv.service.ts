import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import * as Ajv from 'ajv'

@Injectable()
export class AjvService {
  static verify(params: any, schema: any) {
    var ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
    var validate = ajv.compile(schema)
    var valid = validate(params)
    if (!valid) throw new HttpException(validate.errors[0].message, 400)
  }
}
