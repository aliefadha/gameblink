import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBookingsWithMeta } from '@/lib/api/bookings';
import type { PaginatedApiResponse } from '@/types/Api';
import type { Booking } from '@/types/Booking';
import { DataTable } from '@/components/manajemen-booking/data-table';
import { columns } from '@/components/manajemen-booking/columns';
import { Button } from '@/components/ui/button';

/**
 * Example component demonstrating the use of PaginatedApiResponse
 * This shows how to handle pagination with the new API response types
 */
export function PaginatedBookingExample() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDate] = useState<string | undefined>();
    const [bookingType] = useState<string>('all');

    const {
        data: paginatedResponse,
        isLoading,
        error
    } = useQuery({
        queryKey: ['bookings-paginated', selectedDate, bookingType, currentPage],
        queryFn: async (): Promise<PaginatedApiResponse<Booking>> => {
            // This function now returns the full paginated response
            return getBookingsWithMeta(
                selectedDate,
                bookingType === 'all' ? undefined : bookingType
            );
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Extract data and metadata from the paginated response
    const bookings = paginatedResponse?.data.data || [];
    const meta = paginatedResponse?.data.meta;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePreviousPage = () => {
        if (meta && meta.current_page > 1) {
            setCurrentPage(meta.current_page - 1);
        }
    };

    const handleNextPage = () => {
        if (meta && meta.current_page < meta.last_page) {
            setCurrentPage(meta.current_page + 1);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-lg">Loading bookings...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-red-500">
                    Error loading bookings: {error instanceof Error ? error.message : 'Unknown error'}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Data Table */}
            <DataTable columns={columns} data={bookings} isLoading={isLoading} />

            {/* Pagination Controls */}
            {meta && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing {meta.from} to {meta.to} of {meta.total} results
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePreviousPage}
                            disabled={meta.current_page <= 1}
                        >
                            Previous
                        </Button>
                        
                        <div className="flex items-center space-x-1">
                            {meta.links
                                .filter(link => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;')
                                .map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => {
                                            const page = parseInt(link.label);
                                            if (!isNaN(page)) {
                                                handlePageChange(page);
                                            }
                                        }}
                                        disabled={link.url === null}
                                    >
                                        {link.label}
                                    </Button>
                                ))
                            }
                        </div>
                        
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={meta.current_page >= meta.last_page}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Pagination Info */}
            {meta && (
                <div className="text-xs text-gray-500">
                    Page {meta.current_page} of {meta.last_page} • {meta.per_page} items per page
                </div>
            )}
        </div>
    );
}

export default PaginatedBookingExample;