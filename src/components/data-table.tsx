'use client';

import React, { useMemo } from 'react';
import DataTable, { TableProps, TableStyles, Alignment } from 'react-data-table-component';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes'; // Assuming you use next-themes for dark/light mode

interface DataTableWrapperProps<T> extends TableProps<T> {
  filterPlaceholder?: string;
  showFilter?: boolean;
  isLoading?: boolean;
  loadingRows?: number; // Number of skeleton rows to show
}

const customStyles: TableStyles = {
  table: {
    style: {
      // Remove default border/background
    },
  },
  headRow: {
    style: {
      backgroundColor: 'hsl(var(--muted))', // Use muted background for header
      color: 'hsl(var(--muted-foreground))',
      borderBottomWidth: '1px',
      borderBottomColor: 'hsl(var(--border))',
      minHeight: '48px', // Match ShadCN table header height
      fontSize: '0.875rem', // text-sm
      fontWeight: '500', // font-medium
    },
  },
  headCells: {
    style: {
      paddingLeft: '1rem', // Match ShadCN table cell padding
      paddingRight: '1rem',
      color: 'hsl(var(--muted-foreground))',
    },
    draggingStyle: {
        cursor: 'move',
    },
  },
  rows: {
    style: {
      backgroundColor: 'hsl(var(--card))', // Use card background for rows
      color: 'hsl(var(--card-foreground))',
      minHeight: '48px', // Match ShadCN table row height
      borderBottomWidth: '1px',
      borderBottomColor: 'hsl(var(--border))',
      '&:not(:last-of-type)': {
        borderBottomWidth: '1px',
        borderBottomColor: 'hsl(var(--border))',
      },
      '&:hover': {
        backgroundColor: 'hsl(var(--muted) / 0.5)', // Use muted background on hover
      },
    },
    denseStyle: {
        minHeight: '32px',
    },
    selectedHighlightStyle: {
        // Box shadow syntax is slightly different for CSS variables
        // We'll use a simple background color for selected rows
        backgroundColor: 'hsl(var(--accent) / 0.1)',
        color: 'hsl(var(--accent-foreground))',
        borderBottomColor: 'hsl(var(--border))',
    },
    stripedStyle: {
        backgroundColor: 'hsl(var(--muted) / 0.2)',
    },
  },
  cells: {
    style: {
      paddingLeft: '1rem', // Match ShadCN table cell padding
      paddingRight: '1rem',
      fontSize: '0.875rem', // text-sm
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
  pagination: {
    style: {
      backgroundColor: 'hsl(var(--card))',
      color: 'hsl(var(--card-foreground))',
      borderTopWidth: '1px',
      borderTopColor: 'hsl(var(--border))',
      minHeight: '56px',
    },
    pageButtonsStyle: {
      borderRadius: '0.375rem', // rounded-md
      height: '40px',
      width: '40px',
      padding: '8px',
      margin: '2px',
      cursor: 'pointer',
      transition: 'colors 0.2s ease-in-out',
      fill: 'hsl(var(--foreground))', // Icon color
      backgroundColor: 'transparent',
      '&:disabled': {
        cursor: 'not-allowed',
        fill: 'hsl(var(--muted-foreground))',
        opacity: 0.5,
      },
      '&:hover:not(:disabled)': {
        backgroundColor: 'hsl(var(--accent))',
        fill: 'hsl(var(--accent-foreground))', // Icon color on hover
      },
      '&:focus': {
        outline: 'none', // Use ShadCN ring utility if needed
        // boxShadow: '0 0 0 2px hsl(var(--ring))',
      },
    },
  },
  noData: {
      style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100px',
          backgroundColor: 'hsl(var(--card))',
          color: 'hsl(var(--muted-foreground))',
          fontSize: '1rem',
      },
  },
   progress: {
        style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100px',
            backgroundColor: 'hsl(var(--card))',
            color: 'hsl(var(--muted-foreground))',
        },
    },
};

const LoadingSkeleton = ({ rows = 5, columns = 3 }) => (
  <div className="space-y-2 p-4 border rounded-md bg-card">
     {/* Header Skeleton */}
    <div className="flex justify-between items-center h-12 bg-muted rounded-t-md px-4">
       {[...Array(columns)].map((_, i) => (
         <Skeleton key={`header-skel-${i}`} className="h-4 w-24 bg-muted-foreground/20" />
       ))}
    </div>
     {/* Row Skeletons */}
    {[...Array(rows)].map((_, i) => (
      <div key={`row-skel-${i}`} className="flex justify-between items-center h-12 px-4 border-b last:border-b-0">
        {[...Array(columns)].map((_, j) => (
         <Skeleton key={`cell-skel-${i}-${j}`} className="h-4 w-20 bg-muted" />
        ))}
      </div>
    ))}
    {/* Pagination Skeleton (optional) */}
     <div className="flex justify-end items-center h-14 pt-2 px-4">
        <Skeleton className="h-6 w-32 bg-muted" />
     </div>
  </div>
);


export function DataTableWrapper<T>({
  data,
  columns,
  filterPlaceholder = 'Search...',
  showFilter = true,
  isLoading = false,
  loadingRows = 5,
  ...rest
}: DataTableWrapperProps<T>) {
  const [filterText, setFilterText] = React.useState('');
  const { theme } = useTheme();

   const filteredData = useMemo(() => {
    if (!filterText) return data;

    // Basic filtering: checks if filterText is included in any stringified value of the row object
    // You might want a more sophisticated filtering logic based on specific columns
    return data.filter((item: T) =>
      Object.values(item as any).some(value =>
        String(value).toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [data, filterText]);

  const subHeaderComponent = useMemo(() => {
    return showFilter ? (
      <div className="flex justify-end w-full py-2">
        <Input
          placeholder={filterPlaceholder}
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="max-w-xs bg-background" // Ensure input background matches theme
        />
      </div>
    ) : null;
  }, [filterText, filterPlaceholder, showFilter]);


   if (isLoading) {
      const approxColumns = columns.length > 0 ? columns.length : 3;
      return <LoadingSkeleton rows={loadingRows} columns={approxColumns} />;
   }


  // Apply dark theme styles conditionally
  const currentStyles = { ...customStyles };
  if (theme === 'dark') {
     // Example: Adjust specific dark mode styles if needed beyond CSS variables
     // currentStyles.headRow.style.backgroundColor = '#333'; // Or use HSL variables
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        subHeader={showFilter}
        subHeaderComponent={subHeaderComponent}
        subHeaderAlign={Alignment.RIGHT}
        highlightOnHover
        pointerOnHover
        persistTableHead
        customStyles={currentStyles}
        noDataComponent={<div className="p-6 text-center text-muted-foreground">No records found.</div>}
        className="[&_.rdt_Table]:divide-y [&_.rdt_Table]:divide-border [&_.rdt_TableCell]:whitespace-normal" // Adjust whitespace if needed
        {...rest}
      />
    </div>
  );
}
