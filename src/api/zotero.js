import axios from "axios";

const baseURL = 'https://api.zotero.org'

const zoteroRequest = {
    getAllitems: async()=>{
        return await axios(`${baseURL}/groups/4740395/items`,{
            method:'GET',
            headers: {
                'Zotero-API-Version': '3',
                'Zotero-API-Key':'QtlUSBKdwlVRuIJzNaCbi9VD'
            },
            params:{
                "include":"bib",
                "sort":"creator",
                "limit":"1000"
            }
        })
    },
    getItemsTop: async()=>{
        return await axios(`${baseURL}/groups/4740395/items/top`,{
            method:'GET',
            headers: {
                'Zotero-API-Version': '3',
                'Zotero-API-Key':'QtlUSBKdwlVRuIJzNaCbi9VD'

            },
        })
    },
    getOneItem: async(itemKey)=>{
        return await axios(`${baseURL}/groups/4740395/items/${itemKey}`,{
            method:'GET',
            headers: {
                'Zotero-API-Version': '3',
                'Zotero-API-Key':'QtlUSBKdwlVRuIJzNaCbi9VD'
            },
        })
    },
    getOneItemBib: async(itemKey)=>{
        return await axios(`${baseURL}/groups/4740395/items/${itemKey}`,{
            method:'GET',
            headers: {
                'Zotero-API-Version': '3',
                'Zotero-API-Key':'QtlUSBKdwlVRuIJzNaCbi9VD'
            },
            params:{
                format:"bib"
            }
        })
    },
    getOneItemChildren: async(itemKey)=>{
        return await axios(`${baseURL}/groups/4740395/items/${itemKey}/children`,{
            method:'GET',
            headers: {
                'Zotero-API-Version': '3',
                'Zotero-API-Key':'QtlUSBKdwlVRuIJzNaCbi9VD'
            },
            params:{
                format:'json'
            }
        })
    },
}
export default zoteroRequest