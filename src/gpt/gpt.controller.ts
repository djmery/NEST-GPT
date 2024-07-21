import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TranslateDto } from './dtos';
import { Response } from 'express';

//el controlador va a recibir la solicitud (request) y emitir una respuesta

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) { }

  //nombre del endpoint
  @Post('orthography-check')
  orthographyCheck(
    @Body() orthographyDto: OrthographyDto,
  ) {

    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
  ) {
    return this.gptService.prosConsDicusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusseStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    //para emitir respuestas conforme vayan siendo generadas y no esperar
    // es nuestra respuesta, Response lo tomamos de Expresss
    @Res() res: Response
  ) {
    //esto sería el stream de la data
    const stream = await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);

    //cuando cogemos el decorador Res nosotros tenemos que crear la respuesta que vamos a emitir a quien mande la petición
    res.setHeader('Content-Type', 'application/json'); //voy a regresar un JSON
    res.status(HttpStatus.OK);
    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      //console.log(piece);
      res.write(piece);
    }

    res.end();
  }

  @Post('translate')
  async translateCheck(
    @Body() translateDto: TranslateDto,
  ) {
    return this.gptService.translateCheck(translateDto);
  }
}
