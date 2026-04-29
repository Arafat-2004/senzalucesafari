import { NextResponse } from 'next/server'

export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
    details?: unknown
}

export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
    return NextResponse.json({ success: true, data }, { status })
}

export function apiError(error: string, status = 500, details?: unknown): NextResponse<ApiResponse> {
    return NextResponse.json(
        { success: false, error, details: process.env.NODE_ENV === 'development' ? details : undefined },
        { status }
    )
}

export function apiCreated<T>(data: T): NextResponse<ApiResponse<T>> {
    return apiSuccess(data, 201)
}

export function apiNotFound(resource: string): NextResponse<ApiResponse> {
    return apiError(`${resource} not found`, 404)
}

export function apiUnauthorized(message = 'Unauthorized'): NextResponse<ApiResponse> {
    return apiError(message, 401)
}

export function apiBadRequest(message: string, details?: unknown): NextResponse<ApiResponse> {
    return apiError(message, 400, details)
}