import { Component, Input } from '@angular/core';
import { Message } from '../../models/message';


@Component({
  selector: 'message-box',
  templateUrl: 'message-box.html',
  host: {
    '[style.justify-content]': '((!isFromSender) ? "flex-end" : "flex-start")',
    '[style.text-align]': '((!isFromSender) ? "left" : "left")'
  }
})
export class MessageBoxComponent {

  @Input() message: Message;
  @Input() isFromSender: boolean;

  constructor() {

  }

}
