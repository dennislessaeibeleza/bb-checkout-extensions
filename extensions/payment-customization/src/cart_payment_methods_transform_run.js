/**
 * @typedef {import("../generated/api").CartPaymentMethodsTransformRunInput} CartPaymentMethodsTransformRunInput
 * @typedef {import("../generated/api").CartPaymentMethodsTransformRunResult} CartPaymentMethodsTransformRunResult
 */

/**
 * @type {CartPaymentMethodsTransformRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {CartPaymentMethodsTransformRunInput} input
 * @returns {CartPaymentMethodsTransformRunResult}
 */
export function cartPaymentMethodsTransformRun(input) {
  const order = input.shop.paymentCustomization.jsonValue;

  /**
   * Filtra os métodos de pagamento removendo aqueles que não estão visíveis na
   * checkout.
   */
  const paymentsMethods = input.paymentMethods.filter(({ name }) => {
    return !['Deferred', 'Stripe shared token'].includes(name);
  });

  /**
   * Reordena os métodos de pagamento segundo a ordem natural definida no
   * metafield da loja.
   */
  const rerderOperations = order.map(({ name }, i) => {
    const { id } = paymentsMethods
      .find((method) => method.name === name);

    return {
      paymentMethodMove: {
        index: i,
        paymentMethodId: id
      }
    }
  });

  /**
   * Renomeia os métodos de pagamento.
   */
  const renameOperations = order.map(({ name, label }, i) => {
    const { id } = paymentsMethods
      .find((method) => method.name === name);

    return {
      paymentMethodRename: {
        name: label,
        paymentMethodId: id
      }
    }
  });
  
  return {
    operations: rerderOperations.concat(renameOperations)
  };
};
