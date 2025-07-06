<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    protected $fillable = [
        'name',
        'description',
        'icon',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_badges')
            ->withTimestamps()
            ->withPivot('achieved_at');
    }

    public function userBadges()
    {
        return $this->hasMany(UserBadge::class);
    }

    public function achieversCount()
    {
        return $this->users()->count();
    }
}
