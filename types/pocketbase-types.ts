/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Invoices = "invoices",
	Subscriptions = "subscriptions",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type InvoicesRecord<Titems = unknown> = {
	clientAddress?: string
	clientName?: string
	companyAddress?: string
	companyName?: string
	date?: IsoDateString
	dueDate?: IsoDateString
	invoiceNumber?: string
	items?: null | Titems
	subtotal?: number
	tax?: number
	total?: number
}

export enum SubscriptionsIntervalOptions {
	"monthly" = "monthly",
	"yearly" = "yearly",
}
export type SubscriptionsRecord = {
	amount?: number
	end_date?: IsoDateString
	interval?: SubscriptionsIntervalOptions
	next_billing_date?: IsoDateString
	plan_id?: string
	provider?: string
	start_date?: IsoDateString
	status?: string
	user_id?: RecordIdString
}

export type UsersRecord = {
	avatar?: string
	mollie_customer_id?: string
	name?: string
	paypal_customer_id?: string
	stripe_customer_id?: string
}

// Response types include system fields and match responses from the PocketBase API
export type InvoicesResponse<Titems = unknown, Texpand = unknown> = Required<InvoicesRecord<Titems>> & BaseSystemFields<Texpand>
export type SubscriptionsResponse<Texpand = unknown> = Required<SubscriptionsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	invoices: InvoicesRecord
	subscriptions: SubscriptionsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	invoices: InvoicesResponse
	subscriptions: SubscriptionsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'invoices'): RecordService<InvoicesResponse>
	collection(idOrName: 'subscriptions'): RecordService<SubscriptionsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
