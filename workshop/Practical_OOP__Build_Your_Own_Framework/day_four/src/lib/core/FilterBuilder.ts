import {and, not, or, sql, SQLWrapper} from "drizzle-orm";
import { z } from "zod";

export const Operators = {
    // Comparison Operators
    EQUALS: '=',
    NOT_EQUALS: '!=',
    GREATER: '>',
    GREATER_EQUALS: '>=',
    LESS: '<',
    LESS_EQUALS: '<=',

    // Text Operators
    CONTAINS: 'contains',
    NOT_CONTAINS: 'not_contains',
    STARTS_WITH: 'starts_with',
    ENDS_WITH: 'ends_with',
    LIKE: 'like',
    ILIKE: 'ilike',

    // Null checks
    IS_NULL: 'is_null',
    IS_NOT_NULL: 'is_not_null',

    // Lists
    IN: 'in',
    NOT_IN: 'not_in',

    // Ranges
    BETWEEN: 'between',
    NOT_BETWEEN: 'not_between',
} as const;

export type Operator = (typeof Operators)[keyof typeof Operators];

export type Combination = 'and' | 'or';

export const OrderDirections = ['asc', 'desc'] as const;

export type FilterRule = {
    field: string;
    operator: Operator;
    value?: unknown;
}

export const FilterRuleSchema = z.object({
    field: z.string(),
    operator: z.nativeEnum(Operators),
    value: z.any(),
});

export type FilterRuleGroup = {
    combinator: Combination;
    not?: boolean;
    rules: Array<FilterRule | FilterRuleGroup>;
}

export const FilterRuleGroupSchema: z.ZodType<FilterRuleGroup> = z.lazy(() =>
    z.object({
        combinator: z.enum(['and', 'or']),
        not: z.boolean().optional(),
        rules: z.array(z.union([FilterRuleSchema, FilterRuleGroupSchema])),
    })
)

/**
 * ===== FilterBuilder =====
 * Builds a SQLWrapper from a filter rule group
 *
 * @example
 * const filter = {
 *   combinator: 'and',
 *   rules: [
 *     { field: 'name', operator: '=', value: 'John' },
 *     { field: 'age', operator: '>', value: 25 },
 *     {
 *       combinator: 'or',
 *       rules: [
 *         { field: 'city', operator: '=', value: 'New York' },
 *         { field: 'city', operator: '=', value: 'Los Angeles' }
 *       ],
 *        not: false,
 *     }
 *   ],
 * };
 * const sql = FilterBuilder.build(filter);
 * // Generates: (name = 'John' AND age > 25 AND (city = 'New York' OR city = 'Los Angeles'))
 */
export class FilterBuilder {
    static build(filter: FilterRuleGroup): SQLWrapper {
        return this.processRuleGroup(filter);
    }

    static raw(query: SQLWrapper) {
        return query.getSQL();
    }

    private static processRuleGroup(group: FilterRuleGroup): SQLWrapper {
        const conditions = group.rules.map((rule) =>
            this.isRuleGroup(rule)
                ? this.processRuleGroup(rule)
                : this.processRule(rule)
        )

        if (conditions.length === 0) {
            return sql`1==1`;
        }

        const result = (
            group.combinator === 'and' ? and(...conditions) : or(...conditions)
        ) as SQLWrapper;

        return group.not ? not(result) : result;
    }

    private static processRule(rule: FilterRule): SQLWrapper {
        const column = sql.identifier(rule.field);

        switch (rule.operator) {
            case Operators.EQUALS:
                return sql`${column} = ${rule.value}`;

            case Operators.NOT_EQUALS:
                return sql`${column} != ${rule.value}`;

            case Operators.GREATER:
                return sql`${column} > ${rule.value}`;

            case Operators.GREATER_EQUALS:
                return sql`${column} >= ${rule.value}`;

            case Operators.LESS:
                return sql`${column} < ${rule.value}`;

            case Operators.LESS_EQUALS:
                return sql`${column} <= ${rule.value}`;

            case Operators.CONTAINS:
                return sql`${column} ILIKE %${rule.value}%`;

            case Operators.NOT_CONTAINS:
                return sql`${column} NOT ILIKE %${rule.value}%`;

            case Operators.STARTS_WITH:
                return sql`${column} ILIKE ${rule.value}%`;

            case Operators.ENDS_WITH:
                return sql`${column} ILIKE %${rule.value}`;

            case Operators.LIKE:
                return sql`${column} LIKE ${rule.value}`;

            case Operators.ILIKE:
                return sql`${column} ILIKE ${rule.value}`;

            case Operators.IS_NULL:
                return sql`${column} IS NULL`;

            case Operators.IS_NOT_NULL:
                return sql`${column} IS NOT NULL`;

            case Operators.IN:
                if (!Array.isArray(rule.value)) {
                    return sql`${column} = ANY(${rule.value})`;
                }
                return sql`${column} = ANY(ARRAY[${sql.join(rule.value)}])`;

            case Operators.NOT_IN:
                if (!Array.isArray(rule.value)) {
                    return sql`${column} != ANY(${rule.value})`;
                }
                return sql`${column} != ANY(ARRAY[${sql.join(rule.value)}])`;

            case Operators.BETWEEN:
                if (!Array.isArray(rule.value) || rule.value.length !== 2) {
                    throw new Error('Between operator requires two values');
                }
                return sql`${column} BETWEEN ${rule.value[0]} AND ${rule.value[1]}`;

            case Operators.NOT_BETWEEN:
                if (!Array.isArray(rule.value) || rule.value.length !== 2) {
                    throw new Error('Between operator requires two values');
                }
                return sql`${column} NOT BETWEEN ${rule.value[0]} AND ${rule.value[1]}`;

            default:
                throw new Error(`Unknown operator: ${rule.operator}`);
        }
    }

    private static isRuleGroup(rule: FilterRule | FilterRuleGroup): rule is FilterRuleGroup {
        return 'rules' in rule;
    }
}