import i18n from 'i18next'
import {reactI18nextModule} from 'react-i18next'
import localesResourse from '../Assets/locales'
import DeviceInfo from 'react-native-device-info'

const languagueDetector ={
    type:"languagueDetector",
    detect: ()=>DeviceInfo.getDeviceLocale(),
    init:()=>{},
    cacheUserLanguague: ()=>{}
}
i18n
.use(reactI18nextModule)
.use(languagueDetector)
.init({
    resources: localesResourse,
    fallbackLng:"vi",
    debug:true,
    interpolation:{
        escapeValue: false,
    },
    react:{
        wait:true
    }
})
export default i18n