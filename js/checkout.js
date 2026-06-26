// Script para a página de checkout (checkout.html)

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkout-form');
  const deliveryMethodRadios = document.getElementsByName('delivery_method');
  const emailGroup = document.getElementById('email-group');
  const whatsappGroup = document.getElementById('whatsapp-group');
  const successMessage = document.getElementById('success-message');

  // Alternar campos baseados no método de entrega
  deliveryMethodRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'email') {
        emailGroup.style.display = 'block';
        whatsappGroup.style.display = 'none';
        document.getElementById('email').required = true;
        document.getElementById('whatsapp').required = false;
      } else {
        emailGroup.style.display = 'none';
        whatsappGroup.style.display = 'block';
        document.getElementById('email').required = false;
        document.getElementById('whatsapp').required = true;
      }
    });
  });

  // Intercetar o submit do formulário
  if(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const btnSubmit = form.querySelector('button[type="submit"]');
      const originalText = btnSubmit.textContent;
      btnSubmit.textContent = 'A processar...';
      btnSubmit.disabled = true;

      // Recolher os dados do formulário
      const formData = new FormData(form);
      const deliveryMethod = formData.get('delivery_method');
      const contactInfo = deliveryMethod === 'email' ? formData.get('email') : formData.get('whatsapp');

      // Objeto a enviar para o template do EmailJS
      const templateParams = {
        to_email: 'compras.efetuadas.ebook@gmail.com',
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        payment_phone: formData.get('payment_phone'),
        delivery_method: deliveryMethod,
        contact_info: contactInfo,
        price: '20 €'
      };

      /* 
        NOTA PARA INTEGRAÇÃO:
        Para este código funcionar em ambiente real, precisa configurar o EmailJS:
        1. Crie conta em emailjs.com
        2. Adicione um serviço de email (ex: Gmail) e anote o SERVICE_ID
        3. Crie um template de email de acordo com o pedido e anote o TEMPLATE_ID
        4. Inclua a biblioteca no checkout.html e inicie com a sua PUBLIC_KEY (já incluído no HTML)
      */
      
      const SERVICE_ID = 'YOUR_SERVICE_ID'; // Substituir pelo seu Service ID
      const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Substituir pelo seu Template ID

      // Enviar via EmailJS
      emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
        .then(function(response) {
           console.log('SUCCESS!', response.status, response.text);
           form.style.display = 'none';
           successMessage.style.display = 'block';
        }, function(error) {
           console.log('FAILED...', error);
           alert('Ocorreu um erro ao enviar os dados. Por favor, tente novamente ou contacte-nos.');
           btnSubmit.textContent = originalText;
           btnSubmit.disabled = false;
        });
        
        // Simulação caso as credenciais não estejam configuradas:
        /*
        setTimeout(() => {
          form.style.display = 'none';
          successMessage.style.display = 'block';
        }, 1500);
        */
    });
  }
});
