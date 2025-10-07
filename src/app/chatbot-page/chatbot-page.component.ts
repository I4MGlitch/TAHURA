import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-chatbot-page',
  templateUrl: './chatbot-page.component.html',
  styleUrls: ['./chatbot-page.component.css']
})
export class ChatbotPageComponent {

   constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Add the Chatling config script
    const configScript = this.renderer.createElement('script');
    configScript.type = 'text/javascript';
    configScript.text = `
      window.chtlConfig = {
        chatbotId: "4449664164",
        display: "page_inline"
      };
    `;
    this.renderer.appendChild(document.body, configScript);

    // Add the embed script
    const chatScript = this.renderer.createElement('script');
    chatScript.src = 'https://chatling.ai/js/embed.js';
    chatScript.async = true;
    chatScript.setAttribute('data-id', '4449664164');
    chatScript.setAttribute('data-display', 'page_inline');
    chatScript.setAttribute('id', 'chtl-script');
    this.renderer.appendChild(document.body, chatScript);
  }

}
