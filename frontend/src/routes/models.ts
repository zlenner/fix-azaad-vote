export interface Form33Candidate {
  SerialNo: number
  'Name in English': string
  'Name in Urdu': string
  Address: string
  Symbol: string
  Party: string
  symbol_url: string
  pti_backed?: {
    whatsapp_channel: string
  }
}

export type Provinces = 'Punjab' | 'Sindh' | 'KPK' | 'Balochistan'

export interface Constituency {
  'Constituency No': string
  'Constituency Name': string
  'Returning Officer': string
  NumPages: number
  PageFiles: string[]
  Candidates: Form33Candidate[]
  province: Provinces
}
