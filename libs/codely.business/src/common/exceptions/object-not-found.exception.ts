import { NotFoundException } from "@nestjs/common";
import { I18nContext } from "nestjs-i18n";

export class ObjectNotFoundException extends NotFoundException{
    constructor(){
        const lang = I18nContext.current();
        super(lang.t('errors.NotFound'), lang.t('errors.NotFound'));
    }
}