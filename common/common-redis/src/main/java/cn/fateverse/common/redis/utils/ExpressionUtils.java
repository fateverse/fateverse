package cn.fateverse.common.redis.utils;

import org.springframework.expression.EvaluationContext;
import org.springframework.expression.Expression;
import org.springframework.expression.ParserContext;
import org.springframework.expression.common.TemplateParserContext;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.util.ObjectUtils;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Spring Expression 工具类
 *
 * @author Clay
 * @date 2023-05-10
 */
public class ExpressionUtils {
    //el表达式缓存
    private static final Map<String, Expression> EXPRESSION_CACHE = new ConcurrentHashMap<>(64);
    //上下文模板
    private static final ParserContext parserContext = new TemplateParserContext("#{", "}");

    /**
     * 获取Expression对象
     *
     * @param expressionString Spring EL 表达式字符串 例如 param.id
     * @return Expression
     */
    public static Expression getExpression(@Nullable String expressionString) {
        if (ObjectUtils.isEmpty(expressionString)) {
            return null;
        }
        //双重锁检查机制实现表达式的校验
        Expression expression = EXPRESSION_CACHE.get(expressionString);
        if (null == expression) {
            synchronized (EXPRESSION_CACHE) {
                expression = EXPRESSION_CACHE.get(expressionString);
                if (null == expression) {
                    expression = new SpelExpressionParser().parseExpression(expressionString, parserContext);
                    EXPRESSION_CACHE.put(expressionString, expression);
                }
            }
        }
        return expression;
    }

    /**
     * 获取到上下文表达式
     *
     * @param args 参数
     * @return 上下文表达式
     */
    public static EvaluationContext getEvaluationContext(Object[] args, String[] parameterNames) {
        EvaluationContext evaluationContext;
        if (null == args || args.length == 0) {
            return null;
        }
        //如果参数只有一个作为root对象
        evaluationContext = new StandardEvaluationContext();
        for (int i = 0; i < args.length; i++) {
            evaluationContext.setVariable(parameterNames[i], args[i]);
        }
        return evaluationContext;
    }

    /**
     * 根据Spring EL表达式字符串从上下文对象中求值
     *
     * @param context          上下文对象
     * @param expressionString Spring EL表达式
     * @param clazz            值得类型
     * @param <T>              泛型
     * @return 返回值
     */
    public static <T> T getExpressionValue(@Nullable EvaluationContext context, @Nullable String expressionString, @NonNull Class<? extends T> clazz) {
        if (context == null) {
            return null;
        }
        Expression expression = getExpression(expressionString);
        if (expression == null) {
            return null;
        }
        return expression.getValue(context, clazz);
    }

    /**
     * 通过表达式获取到值,不使用泛型
     *
     * @param context          上下文对象
     * @param expressionString Spring EL表达式
     * @param <T>              泛型
     * @return 返回值
     */
    public static <T> T getExpressionValue(@Nullable EvaluationContext context, @Nullable String expressionString) {
        Expression expression = getExpression(expressionString);
        if (expression == null) {
            return null;
        }
        //noinspection unchecked
        return (T) expression.getValue(context);
    }

    /**
     * 求值
     *
     * @param context           上下文对象
     * @param expressionStrings Spring EL表达式
     * @param <T>               泛型 这里的泛型要慎用,大多数情况下要使用Object接收避免出现转换异常
     * @return 结果集
     */
    public static <T> T[] getExpressionValue(@Nullable EvaluationContext context, @Nullable String... expressionStrings) {
        if (context == null) {
            return null;
        }
        if (ObjectUtils.isEmpty(expressionStrings)) {
            return null;
        }
        //noinspection ConstantConditions
        Object[] values = new Object[expressionStrings.length];
        for (int i = 0; i < expressionStrings.length; i++) {
            //noinspection unchecked
            values[i] = (T) getExpressionValue(context, expressionStrings[i]);
        }
        //noinspection unchecked
        return (T[]) values;
    }

    /**
     * 表达式条件求值
     * 如果为值为null则返回false,
     * 如果为布尔类型直接返回,
     * 如果为数字类型则判断是否大于0
     *
     * @param context          上下文对象
     * @param expressionString Spring EL表达式
     * @return 返回值
     */
    @Nullable
    public static boolean getConditionValue(@Nullable EvaluationContext context, @Nullable String expressionString) {
        Object value = getExpressionValue(context, expressionString);
        if (value == null) {
            return false;
        }
        if (value instanceof Boolean) {
            return (boolean) value;
        }
        if (value instanceof Number) {
            return ((Number) value).longValue() > 0;
        }
        return true;
    }

    /**
     * 表达式条件求值
     *
     * @param context           上下文对象
     * @param expressionStrings Spring EL表达式数组
     * @return 返回值
     */
    @Nullable
    public static boolean getConditionValue(@Nullable EvaluationContext context, @Nullable String... expressionStrings) {
        if (context == null) {
            return false;
        }
        if (ObjectUtils.isEmpty(expressionStrings)) {
            return false;
        }
        //noinspection ConstantConditions
        for (String expressionString : expressionStrings) {
            if (!getConditionValue(context, expressionString)) {
                return false;
            }
        }
        return true;
    }
}