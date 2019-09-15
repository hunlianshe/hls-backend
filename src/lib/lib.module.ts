import { Module } from '@nestjs/common'
import { connect } from './mongo'
import { ClientService } from './client.service'
import { SecureService } from './secure.service'
import { AjvService } from './ajv.service'
import { AuthService } from './auth.service'
import { SmsService } from './sms.service'
import { RulesService } from './rules.service'
connect()

@Module({
  providers: [
    ClientService,
    SecureService,
    AjvService,
    AuthService,
    SmsService,
    RulesService,
  ],
})
export class LibModule {}
