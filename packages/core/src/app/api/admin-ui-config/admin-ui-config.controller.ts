import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

import { getConfig } from '@/app/config';
import { EBlocPluginMetadataKeys, UiModuleConfig, getPluginMetadata } from '@/app/plugin';

@Controller('admin-ui-config')
export class AdminUiConfigController {
  @Get('')
  async getAdminUiConfig(@Res() res: Response) {
    const { adminUi } = getConfig();
    const { plugins } = getConfig();

    const extraUiModules = plugins
      .map(p => getPluginMetadata<UiModuleConfig>(EBlocPluginMetadataKeys.UI_MODULES, p))
      .flat()
      .filter(uiModule => uiModule)
      .map(uiModule => ({
        id: uiModule.compiledUiModule.rename,
        ...uiModule.sidebarNavLink
      }));

    const response = {
      branding: adminUi.branding,
      extraUiModules: extraUiModules
    };

    return res.status(200).json(response);
  }
}
