/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Clients = "clients",
	InvoiceDiscounts = "invoice_discounts",
	InvoiceItems = "invoice_items",
	Invoices = "invoices",
	SubscriptionProviders = "subscription_providers",
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

export type ClientsRecord = {
	address?: HTMLString
	description?: string
	name: string
	user_id?: RecordIdString
}

export type InvoiceDiscountsRecord = {
	description?: string
	rate?: number
	user_id?: RecordIdString
}

export type InvoiceItemsRecord = {
	description?: string
	name?: string
	quantity?: number
	rate?: number
	subtotal?: number
	tax?: number
	total?: number
	user_id?: RecordIdString
}

export enum InvoicesStatusOptions {
	"not_sent" = "not_sent",
	"sent" = "sent",
	"paid" = "paid",
	"canceled" = "canceled",
}
export type InvoicesRecord = {
	client_id?: RecordIdString
	due_date?: IsoDateString
	footer?: string
	invoice_discount_ids?: RecordIdString[]
	invoice_item_ids?: RecordIdString[]
	invoice_number: string
	is_draft?: boolean
	issue_date: IsoDateString
	status: InvoicesStatusOptions
	subtotal?: number
	tax?: number
	text?: HTMLString
	total?: number
	user_id: RecordIdString
}

export type SubscriptionProvidersRecord = {
	name: string
}

export enum SubscriptionsPlanOptions {
	"free" = "free",
	"monthly" = "monthly",
	"yearly" = "yearly",
}
export type SubscriptionsRecord = {
	end_date?: IsoDateString
	next_billing_date?: IsoDateString
	plan?: SubscriptionsPlanOptions
	provider_id?: RecordIdString
	start_date?: IsoDateString
	status?: string
	user_id: RecordIdString
}

export type UsersRecord = {
	avatar?: string
	mollie_customer_id?: string
	name?: string
	paypal_customer_id?: string
	stripe_customer_id?: string
}

// Response types include system fields and match responses from the PocketBase API
export type ClientsResponse<Texpand = unknown> = Required<ClientsRecord> & BaseSystemFields<Texpand>
export type InvoiceDiscountsResponse<Texpand = unknown> = Required<InvoiceDiscountsRecord> & BaseSystemFields<Texpand>
export type InvoiceItemsResponse<Texpand = unknown> = Required<InvoiceItemsRecord> & BaseSystemFields<Texpand>
export type InvoicesResponse<Texpand = unknown> = Required<InvoicesRecord> & BaseSystemFields<Texpand>
export type SubscriptionProvidersResponse<Texpand = unknown> = Required<SubscriptionProvidersRecord> & BaseSystemFields<Texpand>
export type SubscriptionsResponse<Texpand = unknown> = Required<SubscriptionsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	clients: ClientsRecord
	invoice_discounts: InvoiceDiscountsRecord
	invoice_items: InvoiceItemsRecord
	invoices: InvoicesRecord
	subscription_providers: SubscriptionProvidersRecord
	subscriptions: SubscriptionsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	clients: ClientsResponse
	invoice_discounts: InvoiceDiscountsResponse
	invoice_items: InvoiceItemsResponse
	invoices: InvoicesResponse
	subscription_providers: SubscriptionProvidersResponse
	subscriptions: SubscriptionsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'clients'): RecordService<ClientsResponse>
	collection(idOrName: 'invoice_discounts'): RecordService<InvoiceDiscountsResponse>
	collection(idOrName: 'invoice_items'): RecordService<InvoiceItemsResponse>
	collection(idOrName: 'invoices'): RecordService<InvoicesResponse>
	collection(idOrName: 'subscription_providers'): RecordService<SubscriptionProvidersResponse>
	collection(idOrName: 'subscriptions'): RecordService<SubscriptionsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
