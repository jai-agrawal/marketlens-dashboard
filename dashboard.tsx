"use client"

import * as React from "react"
import { CalendarIcon, Check, ChevronsUpDown, Download } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ProductData {
  keyword: string
  location: string
  product_id: number
  product_name: string
  brand: string
  price: number
  mrp: number
  discount_percent: string
  inventory: number
  quantity: number
  state: string
  category: string
  position: number
  rating: string
  pin_code: string
  date: string
  time_of_day: string
  source: string
  locality: string
  city: string
}

export default function Dashboard() {
  const [data, setData] = React.useState<ProductData[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Filter states
  const [selectedBrand, setSelectedBrand] = React.useState<string>("")
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<string[]>([])
  const [pinCodeFilter, setPinCodeFilter] = React.useState<string>("")
  const [dateFilter, setDateFilter] = React.useState<Date>()
  const [platformsOpen, setPlatformsOpen] = React.useState(false)

  // Fetch and parse CSV data
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/combined_output-qRzViZjkEMdHLYfOfzNSAxI4H30zIz.csv",
        )
        const csvText = await response.text()

        // Parse CSV
        const lines = csvText.split("\n")
        const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

        const parsedData: ProductData[] = []
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue

          const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
          if (values.length === headers.length) {
            const row: any = {}
            headers.forEach((header, index) => {
              row[header] = values[index]
            })

            // Convert numeric fields
            row.product_id = Number.parseFloat(row.product_id) || 0
            row.price = Number.parseFloat(row.price) || 0
            row.mrp = Number.parseFloat(row.mrp) || 0
            row.inventory = Number.parseFloat(row.inventory) || 0
            row.quantity = Number.parseFloat(row.quantity) || 0
            row.position = Number.parseFloat(row.position) || 0

            parsedData.push(row as ProductData)
          }
        }

        setData(parsedData)
      } catch (err) {
        setError("Failed to load data")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get unique values for filters
  const uniqueBrands = React.useMemo(() => {
    return Array.from(new Set(data.map((item) => item.brand)))
      .filter(Boolean)
      .sort()
  }, [data])

  const uniquePlatforms = React.useMemo(() => {
    return Array.from(new Set(data.map((item) => item.source)))
      .filter(Boolean)
      .sort()
  }, [data])

  // Filter data based on selected filters
  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const brandMatch = !selectedBrand || item.brand === selectedBrand
      const platformMatch = selectedPlatforms.length === 0 || selectedPlatforms.includes(item.source)
      const pinCodeMatch = !pinCodeFilter || item.pin_code.includes(pinCodeFilter)
      const dateMatch = !dateFilter || item.date === format(dateFilter, "yyyy-MM-dd")

      return brandMatch && platformMatch && pinCodeMatch && dateMatch
    })
  }, [data, selectedBrand, selectedPlatforms, pinCodeFilter, dateFilter])

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]))
  }

  const exportToCSV = () => {
    const headers = ["Product Name", "PIN Code", "Platform", "Price", "MRP", "Discount %", "Position", "Rating", "Date"]
    const csvContent = [
      headers.join(","),
      ...filteredData.map((item) =>
        [
          `"${item.product_name}"`,
          item.pin_code,
          item.source,
          item.price,
          item.mrp,
          item.discount_percent,
          item.position,
          item.rating,
          item.date,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "dashboard_export.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error loading data: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Product Analytics Dashboard</h1>
          <Badge variant="outline" className="text-sm">
            {data.length} total products
          </Badge>
        </div>

        {/* Filters Section */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Brand Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {uniqueBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Platform Multi-select */}
              <div className="space-y-2">
                <Label>Platforms</Label>
                <Popover open={platformsOpen} onOpenChange={setPlatformsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={platformsOpen}
                      className="w-full justify-between"
                    >
                      {selectedPlatforms.length === 0 ? "Select platforms" : `${selectedPlatforms.length} selected`}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search platforms..." />
                      <CommandList>
                        <CommandEmpty>No platform found.</CommandEmpty>
                        <CommandGroup>
                          {uniquePlatforms.map((platform) => (
                            <CommandItem key={platform} value={platform} onSelect={() => togglePlatform(platform)}>
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedPlatforms.includes(platform) ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {platform}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* PIN Code Filter */}
              <div className="space-y-2">
                <Label htmlFor="pincode">PIN Code</Label>
                <Input
                  id="pincode"
                  placeholder="Enter PIN code"
                  value={pinCodeFilter}
                  onChange={(e) => setPinCodeFilter(e.target.value)}
                />
              </div>

              {/* Date Filter */}
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateFilter && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Selected Filters Display */}
            {(selectedBrand || selectedPlatforms.length > 0 || pinCodeFilter || dateFilter) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedBrand && (
                  <Badge variant="secondary" className="gap-1">
                    Brand: {selectedBrand}
                    <button
                      onClick={() => setSelectedBrand("")}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-full"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedPlatforms.map((platform) => (
                  <Badge key={platform} variant="secondary" className="gap-1">
                    {platform}
                    <button
                      onClick={() => togglePlatform(platform)}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-full"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {pinCodeFilter && (
                  <Badge variant="secondary" className="gap-1">
                    PIN: {pinCodeFilter}
                    <button
                      onClick={() => setPinCodeFilter("")}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-full"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {dateFilter && (
                  <Badge variant="secondary" className="gap-1">
                    Date: {format(dateFilter, "MMM dd, yyyy")}
                    <button
                      onClick={() => setDateFilter(undefined)}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-full"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredData.length} of {data.length} results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedBrand("")
                setSelectedPlatforms([])
                setPinCodeFilter("")
                setDateFilter(undefined)
              }}
            >
              Clear All Filters
            </Button>
            <Button variant="outline" onClick={exportToCSV} className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Product Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>PIN Code</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>MRP</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No data found matching the selected filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.slice(0, 100).map((item, index) => (
                      <TableRow key={`${item.product_id}-${index}`}>
                        <TableCell className="font-medium max-w-xs">
                          <div className="truncate" title={item.product_name}>
                            {item.product_name}
                          </div>
                          <div className="text-xs text-muted-foreground">{item.brand}</div>
                        </TableCell>
                        <TableCell>{item.pin_code}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {item.source}
                          </Badge>
                        </TableCell>
                        <TableCell>₹{item.price}</TableCell>
                        <TableCell className="text-muted-foreground">₹{item.mrp}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{item.discount_percent}%</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={item.position <= 10 ? "default" : "secondary"}
                            className={item.position <= 10 ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            #{item.position}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            {item.rating}
                          </div>
                        </TableCell>
                        <TableCell>{item.date}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {filteredData.length > 100 && (
                <div className="p-4 text-center text-sm text-muted-foreground border-t">
                  Showing first 100 results. Use filters to narrow down the data.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
