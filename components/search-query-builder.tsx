"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Code, Eye } from "lucide-react"

interface QueryCondition {
  id: string
  field: string
  operator: string
  value: string
  type: "text" | "number" | "date" | "select"
}

interface QueryGroup {
  id: string
  operator: "AND" | "OR"
  conditions: QueryCondition[]
}

const fieldOptions = [
  { value: "name", label: "Name", type: "text" },
  { value: "email", label: "Email", type: "text" },
  { value: "position", label: "Position", type: "text" },
  { value: "company", label: "Company", type: "text" },
  { value: "status", label: "Status", type: "select" },
  { value: "riskLevel", label: "Risk Level", type: "select" },
  { value: "score", label: "Screening Score", type: "number" },
  { value: "createdAt", label: "Created Date", type: "date" },
  { value: "lastScreened", label: "Last Screened", type: "date" },
]

const operatorOptions = {
  text: [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "startsWith", label: "Starts with" },
    { value: "endsWith", label: "Ends with" },
  ],
  number: [
    { value: "equals", label: "Equals" },
    { value: "greaterThan", label: "Greater than" },
    { value: "lessThan", label: "Less than" },
    { value: "between", label: "Between" },
  ],
  date: [
    { value: "equals", label: "On" },
    { value: "after", label: "After" },
    { value: "before", label: "Before" },
    { value: "between", label: "Between" },
  ],
  select: [
    { value: "equals", label: "Is" },
    { value: "in", label: "Is one of" },
  ],
}

export function SearchQueryBuilder() {
  const [queryGroups, setQueryGroups] = useState<QueryGroup[]>([
    {
      id: "1",
      operator: "AND",
      conditions: [
        {
          id: "1",
          field: "name",
          operator: "contains",
          value: "",
          type: "text",
        },
      ],
    },
  ])
  const [showSQL, setShowSQL] = useState(false)

  const addCondition = (groupId: string) => {
    setQueryGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: [
                ...group.conditions,
                {
                  id: Date.now().toString(),
                  field: "name",
                  operator: "contains",
                  value: "",
                  type: "text",
                },
              ],
            }
          : group,
      ),
    )
  }

  const removeCondition = (groupId: string, conditionId: string) => {
    setQueryGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.filter((c) => c.id !== conditionId),
            }
          : group,
      ),
    )
  }

  const updateCondition = (groupId: string, conditionId: string, updates: Partial<QueryCondition>) => {
    setQueryGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.map((condition) =>
                condition.id === conditionId ? { ...condition, ...updates } : condition,
              ),
            }
          : group,
      ),
    )
  }

  const addGroup = () => {
    setQueryGroups((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        operator: "AND",
        conditions: [
          {
            id: Date.now().toString() + "_1",
            field: "name",
            operator: "contains",
            value: "",
            type: "text",
          },
        ],
      },
    ])
  }

  const removeGroup = (groupId: string) => {
    if (queryGroups.length > 1) {
      setQueryGroups((prev) => prev.filter((group) => group.id !== groupId))
    }
  }

  const generateSQL = () => {
    const groupClauses = queryGroups
      .map((group) => {
        const conditionClauses = group.conditions
          .filter((condition) => condition.value)
          .map((condition) => {
            const field = condition.field
            const value = condition.value

            switch (condition.operator) {
              case "contains":
                return `${field} ILIKE '%${value}%'`
              case "equals":
                return `${field} = '${value}'`
              case "startsWith":
                return `${field} ILIKE '${value}%'`
              case "endsWith":
                return `${field} ILIKE '%${value}'`
              case "greaterThan":
                return `${field} > ${value}`
              case "lessThan":
                return `${field} < ${value}`
              case "after":
                return `${field} > '${value}'`
              case "before":
                return `${field} < '${value}'`
              default:
                return `${field} = '${value}'`
            }
          })

        return conditionClauses.length > 0 ? `(${conditionClauses.join(` ${group.operator} `)})` : ""
      })
      .filter(Boolean)

    return groupClauses.length > 0
      ? `SELECT * FROM candidates WHERE ${groupClauses.join(" AND ")}`
      : "SELECT * FROM candidates"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Query Builder
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowSQL(!showSQL)}>
              <Eye className="h-4 w-4 mr-2" />
              {showSQL ? "Hide" : "Show"} SQL
            </Button>
            <Button size="sm" onClick={addGroup}>
              <Plus className="h-4 w-4 mr-2" />
              Add Group
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {queryGroups.map((group, groupIndex) => (
          <div key={group.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Group {groupIndex + 1}</Badge>
                <Select
                  value={group.operator}
                  onValueChange={(value: "AND" | "OR") =>
                    setQueryGroups((prev) => prev.map((g) => (g.id === group.id ? { ...g, operator: value } : g)))
                  }
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {queryGroups.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => removeGroup(group.id)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {group.conditions.map((condition, conditionIndex) => (
                <div key={condition.id} className="grid grid-cols-12 gap-2 items-end">
                  {conditionIndex > 0 && (
                    <div className="col-span-1 text-center text-sm text-muted-foreground">{group.operator}</div>
                  )}
                  <div className={conditionIndex === 0 ? "col-span-3" : "col-span-2"}>
                    <Label>Field</Label>
                    <Select
                      value={condition.field}
                      onValueChange={(value) => {
                        const field = fieldOptions.find((f) => f.value === value)
                        updateCondition(group.id, condition.id, {
                          field: value,
                          type: field?.type as any,
                          operator:
                            operatorOptions[field?.type as keyof typeof operatorOptions]?.[0]?.value || "equals",
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldOptions.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label>Operator</Label>
                    <Select
                      value={condition.operator}
                      onValueChange={(value) => updateCondition(group.id, condition.id, { operator: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {operatorOptions[condition.type]?.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Label>Value</Label>
                    <Input
                      value={condition.value}
                      onChange={(e) => updateCondition(group.id, condition.id, { value: e.target.value })}
                      placeholder="Enter value..."
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCondition(group.id, condition.id)}
                      disabled={group.conditions.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={() => addCondition(group.id)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
          </div>
        ))}

        {showSQL && (
          <div className="bg-muted p-4 rounded-lg">
            <Label className="text-sm font-medium">Generated SQL Query:</Label>
            <pre className="text-sm mt-2 whitespace-pre-wrap font-mono">{generateSQL()}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
