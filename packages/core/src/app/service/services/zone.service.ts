import { clean } from '@ebloc/common';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In } from 'typeorm';

import { ErrorResult } from '../utils';

import { CreateZoneInput, ListInput, UpdateZoneInput, ZoneErrorCode } from '@/app/api/common';
import { CountryEntity, ID, ShippingMethodEntity, ZoneEntity } from '@/app/persistance';

@Injectable()
export class ZoneService {
  constructor(@InjectDataSource() private db: DataSource) {}

  /**
   * Fin unique zone by id.
   */
  findUnique(input: FindUniqueInput) {
    if (typeof input.id === 'string') {
      return this.db.getRepository(ZoneEntity).findOne({ where: { id: input.id } });
    }

    if (typeof input.name === 'string') {
      return this.db.getRepository(ZoneEntity).findOne({ where: { name: input.name } });
    }

    throw new Error('You must provide either an ID or a NAME to find a zone');
  }

  /**
   * Find all zones.
   */
  find(input?: ListInput) {
    return this.db.getRepository(ZoneEntity).find({
      ...clean(input ?? {}),
      order: { createdAt: 'ASC' }
    });
  }

  /**
   * Find all countries in a zone.
   */
  async findCountries(id: ID, input?: ListInput) {
    const result = await this.db.getRepository(CountryEntity).find({
      where: { zones: { id } },
      ...clean(input ?? {})
    });

    return result;
  }

  /**
   * Find all shipping methods in a zone.
   */
  async findShippingMethods(id: ID, input?: ListInput) {
    const result = await this.db.getRepository(ShippingMethodEntity).find({
      where: { zone: { id } },
      ...clean(input ?? {}),
      order: { createdAt: 'ASC' }
    });

    return result;
  }

  /**
   * Create a new zone.
   *
   * 1. Check if a zone with the same name already exists.
   * 2. Save zone
   */
  async create(input: CreateZoneInput) {
    const zoneWithSameName = await this.findUnique({ name: input.name });

    if (zoneWithSameName) {
      return new ErrorResult(ZoneErrorCode.DUPLICATED_ZONE_NAME, 'Zone name already exists');
    }

    return await this.db.getRepository(ZoneEntity).save(input);
  }

  /**
   * Update a zone by the given id.
   *
   * 1. Check if a zone with the same name already exists.
   * 2. Update zone
   */
  async update(id: ID, input: UpdateZoneInput) {
    const zone = await this.findUnique({ id });

    if (!zone) {
      return new ErrorResult(ZoneErrorCode.ZONE_NOT_FOUND, 'Zone not found');
    }

    const zoneWithSameName = await this.findUnique({ name: input.name ?? '' });

    if (zoneWithSameName && zoneWithSameName.id !== id) {
      return new ErrorResult(ZoneErrorCode.DUPLICATED_ZONE_NAME, 'Zone name already exists');
    }

    return await this.db.getRepository(ZoneEntity).save({
      ...zone,
      ...clean(input)
    });
  }

  /**
   * Remove a zone by the given id and its shipping methods.
   */
  async remove(id: ID) {
    const zone = await this.findUnique({ id });

    if (!zone) {
      return new ErrorResult(ZoneErrorCode.ZONE_NOT_FOUND, 'Zone not found');
    }

    return await this.db.getRepository(ZoneEntity).remove(zone);
  }

  /**
   * Set countries to a zone.
   *
   * 1. If any country is disabled, return an error.
   * 2. Save zone with the new countries.
   *
   * @warning This method will replace all countries that are already in the zone with the new ones.
   */
  async setCountries(id: ID, countriesIds: ID[]) {
    const zone = await this.findUnique({ id });

    if (!zone) {
      return new ErrorResult(ZoneErrorCode.ZONE_NOT_FOUND, 'Zone not found');
    }

    const countries = await this.db
      .getRepository(CountryEntity)
      .find({ where: { id: In(countriesIds) } });

    const countryDisabled = countries.find(country => !country.enabled);

    if (countryDisabled) {
      return new ErrorResult(
        ZoneErrorCode.DISABLED_COUNTRY,
        `Country with id "${countryDisabled.id}" is disabled`
      );
    }

    return this.db.getRepository(ZoneEntity).save({
      ...zone,
      countries
    });
  }
}

type FindUniqueInput = { id?: ID; name?: string };
