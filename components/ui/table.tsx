import * as React from "react"

export const Table = ({ children }: { children: React.ReactNode }) => <table className="w-full">{children}</table>
export const TableHead = ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>
export const TableBody = ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>
export const TableRow = ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>
export const TableCell = ({ children, className }: { children: React.ReactNode, className?: string }) => <td className={className}>{children}</td>
export const TableHeader = ({ children }: { children: React.ReactNode }) => <th>{children}</th>